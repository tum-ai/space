from fastapi.testclient import TestClient

from space_api.main import app

client = TestClient(app)


def test_root() -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "Welcome to tumai-space"}