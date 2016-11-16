from Messenger import Messenger
from db import Database as DB
from multiprocessing import Process
import json


class DataMessageRouter(object):
    def __init__(self, host):
        self._messenger = Messenger(host)
        self._db = DB()

        # self._messenger.wait(self.post, 'post_data')
        # self._messenger.wait(self.update, 'update_data')
        self._messenger.wait(self.get, 'get_data')
        # self._messenger.wait(self.delete, 'delete_data')
        self._messenger.consume()

    # def post(self, channel, method, properties, body):
    #     p = Process(target=self._post, args=(self, channel, method, properties, body))
    #     p.start()
    #     p.join()
    #
    # def _post(self, channel, method, properties, body):
    #     data = json.loads(body.decode("utf-8"))
    #     self._data_manager.post(data)
    #
    #     # process completed, send acknowledgment
    #     channel.basic_ack(delivery_tag=method.delivery_tag)
    #     message = json.dumps({"success": True})
    #     self._messenger.respond(channel, properties, message)
    #
    # def update(self, channel, method, properties, body):
    #     p = Process(target=self._update, args=(self, channel, method, properties, body))
    #     p.start()
    #     p.join()
    #
    # def _update(self, channel, method, properties, body):
    #     data = json.loads(body)
    #     self._data_manager.update(body)
    #
    #     # process completed, send acknowledgment
    #     channel.basic_ack(delivery_tag=method.delivery_tag)

    def get(self, channel, method, properties, body):
        p = Process(target=self._get, args=(channel, method, properties, body))
        p.start()
        p.join()

    def _get(self, channel, method, properties, body):
        data = json.loads(body.decode("utf-8"))
        message = json.dumps(self._db.select(data['table'], *data['columns'], **data["where"]))
        print(message)
        self._messenger.respond(channel, properties, message)
        # process completed, send acknowledgment
        channel.basic_ack(delivery_tag=method.delivery_tag)

    # def delete(self, channel, method, properties, body):
    #     p = Process(target=self._delete, args=(self, channel, method, properties, body))
    #     p.start()
    #     p.join()
    #
    # def _delete(self, channel, method, properties, body):
    #     data = json.loads(body.decode("utf-8"))
    #     self._data_manager.delete(data["data_id"])
    #     # process completed, send acknowledgment
    #     message = {
    #         "success": True,
    #     }
    #     message = json.dumps(message)
    #     self._messenger.respond(channel, properties, message)
    #     channel.basic_ack(delivery_tag=method.delivery_tag)


def main():
    # todo create multiple threads
    p = DataMessageRouter('localhost')


if __name__ == '__main__':
    main()