from fastapi import APIRouter

router = APIRouter()


@router.get("/test")
def test() -> str:
    return "Hello world"
