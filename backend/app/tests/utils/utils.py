import random
import string


def random_lower_string(amount: int = 32) -> str:
    return "".join(random.choices(string.ascii_lowercase, k=amount))


def random_email() -> str:
    return f"{random_lower_string(10)}@{random_lower_string(5)}.com"


def random_int(min: int = 1, max: int = 100) -> int:
    return random.randint(min, max)
