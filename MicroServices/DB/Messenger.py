import pika
import uuid
from multiprocessing import Process


class Messenger(object):
    def __init__(self, host):
        self._connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=host)
        )
        self._channel = self._connection.channel()
        result = self._channel.queue_declare(exclusive=True)
        self._callback_queue = result.method.queue
        self._response = None
        self._corr_id = None

    def wait(self, task, queue, durable=True):
        print("Waiting...")
        self._channel.queue_declare(queue=queue, durable=durable)
        self._channel.basic_consume(task, queue=queue)

    def consume(self):
        self._channel.start_consuming()

    @staticmethod
    def respond(channel, head, body):
        if not head.reply_to:
            raise ValueError("Cannot reply without a reply to address...")
        print("replying with '" + body + "' to " + head.correlation_id)
        channel.basic_publish(
            exchange='',
            routing_key=head.reply_to,
            properties=pika.BasicProperties(
                correlation_id=head.correlation_id
            ),
            body=body
        )

    def send(self, message, queue):
        self._channel.basic_publish(
            exchange='',
            routing_key=queue,
            body=message,
            properties=pika.BasicProperties(
                delivery_mode=2
            )
        )

    def send_for_response(self, message, queue):
        self._response = None
        self._corr_id = str(uuid.uuid4())
        self._channel.basic_publish(
            exchange='',
            routing_key=queue,
            properties=pika.BasicProperties(
                reply_to=self._callback_queue,
                correlation_id=self._corr_id,
            ),
            body=message)
        while self._response is None:
            self._connection.process_data_events()
        return self._response

    def on_response(self, channel, method, head, body):
        if self._corr_id == head.correlation_id:
            self._response = body
