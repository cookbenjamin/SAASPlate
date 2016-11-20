import psycopg2 as pg


class Database(object):
    def __init__(self, commit=True, verbose=False):
        self.create_tables()
        self._connection = pg.connect(user="postgres", host="db")
        print("connected")
        self._commit = commit
        self.last_id = None
        self._verbose = verbose

    def create_tables(self):
        connection = pg.connect(host="db", user="postgres")
        with open("users.sql", 'r') as file:
            sql_file = file.read()
        sql_commands = sql_file.split(";")
        print(sql_commands)
        with connection.cursor() as cursor:
            for command in sql_commands:
                if command != "":
                    cursor.execute(command)
                    connection.commit()

    def insert(self, table, **kwargs):
        fields, values = self.format_kwargs_for_insert(**kwargs)
        sql = "INSERT INTO {table} ({fields}) VALUES ({values});".format(
            table=table,
            fields=fields,
            values=values
        )
        self.execute(sql)

    def select(self, table, *args, **kwargs):
        where = self.format_where(**kwargs)
        if len(args) == 0:
            columns = "*"
        else:
            columns = ", ".join(self.format_colums( * args))
        sql = "SELECT {columns} FROM {table} WHERE {where}".format(
            columns=columns,
            table=table,
            where=where
        )
        return self.execute(sql, result=True)

    def delete(self, table, *args, **kwargs):
        where = self.format_where(**kwargs)
        columns = ", ".join(self.format_colums(*args))
        sql = "DELETE {columns} FROM {table} WHERE {where}".format(
            columns=columns,
            table=table,
            where=where
        )
        self.execute(sql)

    def execute(self, sql, result=False):
        if self._verbose:
            print("Executing query:", sql)
        res = None
        with self._connection.cursor() as cursor:
            cursor.execute(sql)
            if result:
                res = self.pythonify_result(cursor.description,
                                               cursor.fetchall())
            self.last_id = cursor.lastrowid
            if self._verbose:
                print("Query sent.")
        if self._commit:
            self._connection.commit()
            if self._verbose:
                print("Query committed.")
        if result:
            return res

    def pythonify_result(self, description, result):
        keys = [des[0] for des in description]
        return [{key: val for (key, val) in zip(keys, values)} for values in
                result]

    def format_where(self, **kwargs):
        return " AND ".join(["{key} = {value}".format(key=key, value=value)
                      for (key, value)
                             in zip(self.format_colums(*kwargs.keys()),
                                self.format_values(*kwargs.values()))])

    def format_values(self, *values):
        return ["\'{0}\'".format(value) if isinstance(value, type(""))
                else str(value) for value in values]

    def format_colums(self, *columns):
        return ["{column}".format(column=column) for column in columns]

    def format_kwargs_for_insert(self, **kwargs):
        values = self.format_values(*kwargs.values())
        columns = self.format_colums(*kwargs.keys())
        return ", ".join(columns), ", ".join(values)

if __name__ == '__main__':
    db = Database(verbose=True)
    info = {
        "user_id": 1,
        "name": "Hello",
    }
    columns = ["id"]
    print(db.select("models", **info))
