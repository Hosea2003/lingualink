import os
from uuid import uuid4

def upload_to(path):
    def wrapper(instance, filename: str):
        ext = filename.split(".")[-1]

        #         set the filename as a random string
        filename = '{}.{}'.format(uuid4().hex, ext)
        return os.path.join(path, filename)

    return wrapper