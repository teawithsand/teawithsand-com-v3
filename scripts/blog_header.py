from uuid import uuid4
from datetime import datetime

if __name__ == "__main__":
    print("uuid: %s" % str(uuid4()))
    print("createdAt: %s " % datetime.now().isoformat())