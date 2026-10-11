"""Backend smoke tests — run from app/backend:  python -m pytest ../tests"""

from fastapi.testclient import TestClient

from server import app

client = TestClient(app)


def test_health_ok():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_store_info_matches_shop():
    info = client.get("/api/store").json()
    assert info["email"] == "avaysoni123@gmail.com"
    assert "Siraha" in info["street"]
    assert info["phone"] == "+977 9829770284"


def test_inquiry_roundtrip(tmp_path, monkeypatch):
    import server

    monkeypatch.setattr(server, "INBOX_FILE", tmp_path / "inquiries.jsonl")
    created = client.post(
        "/api/inquiries",
        json={"name": "Test", "email": "test@example.com", "topic": "General enquiry", "message": "Hello"},
    )
    assert created.status_code == 201
    listed = client.get("/api/inquiries").json()
    assert len(listed) == 1
    assert listed[0]["email"] == "test@example.com"


def test_inquiry_rejects_bad_email():
    res = client.post("/api/inquiries", json={"name": "Test", "email": "not-an-email"})
    assert res.status_code == 422
