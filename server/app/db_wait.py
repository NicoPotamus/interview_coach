import time
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

def wait_for_db(url: str, timeout: int = 30, interval: int = 2):
    """
    Attempts to connect to the database at the given URL until it's ready,
    or until the timeout is reached.

    Args:
        url (str): SQLAlchemy-compatible database URL.
        timeout (int): Total time to wait for the database (in seconds).
        interval (int): Wait time between retry attempts (in seconds).

    Raises:
        TimeoutError: If the database is not reachable within the timeout.
    """
    print(f"⏳ Waiting for database at {url}...")
    start_time = time.time()

    while time.time() - start_time < timeout:
        try:
            engine = create_engine(url)
            with engine.connect() as conn:
                print("Database is ready!")
                return
        except OperationalError as e:
            print(f"Still waiting... {e}")
            time.sleep(interval)

    raise TimeoutError(f"❌ Could not connect to the database after {timeout} seconds.")