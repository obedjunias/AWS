import time
import boto3
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from pathlib import Path

ACCESS_KEY = 'Access Key'  # for that particular user
SECRET_ACCESS_KEY = 'Secret Access key'  # for that particular user


class MyHandler(FileSystemEventHandler):

    def on_created(self, event):
        print(f'event type: {event.event_type}  path : {event.src_path} ')
        s3 = boto3.client('s3')
        filename = event.src_path
        bucket_name = 'bucket_name'
        key = Path(event.src_path).name

        s3.upload_file(filename, bucket_name, key)


if __name__ == "__main__":
    # Object to custom handler
    event_handler = MyHandler()
    # Observer thread that schedules watching directories and dispatches calls to event handlers.
    observer = Observer()
    # path is the directory in which the changes are observed for.
    # Use './' to observe in the same directory
    # Use '../' to observe in the outer directory
    observer.schedule(event_handler, path='./', recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)  # halt the process every 1 second to observe for modifications
    except KeyboardInterrupt:  # CTRL+C to exit
        observer.stop()
    observer.join()
