"""Exercise saved-result reminders and queue acknowledgements without a model call."""
import hashlib
import json
import tempfile
import unittest
from pathlib import Path

import notification_guard as guard


class NotificationGuardTest(unittest.TestCase):
    def test_result_notification_lifecycle(self):
        session = "01a0a48a-4149-7bb3-9eba-7835dfc56ebb"
        parent = "01a0a3b8-5162-78f0-ac39-4e17f730a70a"
        event = {"hook_event_name": "Stop", "session_id": session, "stop_hook_active": False}
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            state, artifact = root / "state", root / "decisions.json"
            self.assertEqual(guard.on_stop(event, state), {})
            guard.register(session, parent, "work-a", "adjudication", artifact, root, state, root)
            self.assertEqual(guard.on_stop(event, state), {})
            with self.assertRaises(ValueError):
                guard.register(session, parent, "work-b", "adjudication", artifact, root, state, root)
            with self.assertRaises(ValueError):
                guard.register(session, parent, "work-a", "adjudication", root.parent / "outside.json", root, state, root)
            artifact.write_text(json.dumps({"works": [{"workId": "work-a", "disposition": "hold"}]}))
            self.assertEqual(guard.on_stop({**event, "stop_hook_active": True}, state), {})
            self.assertEqual(guard.on_stop({**event, "hook_event_name": "Interrupt"}, state), {})
            original = artifact.read_bytes()
            self.assertEqual(guard.on_stop(event, state)["decision"], "block")
            guard.register(session, parent, "work-a", "adjudication", artifact, root, state, root)
            self.assertEqual(guard.on_stop(event, state), {})
            sha = hashlib.sha256(original).hexdigest()
            with self.assertRaises(ValueError):
                guard.acknowledge(session, sha, {"isError": True}, state)
            with self.assertRaises(ValueError):
                guard.acknowledge(session, sha, {"threadId": session}, state)
            guard.acknowledge(session, sha, {"content": [{"type": "text", "text": json.dumps({"threadId": parent})}], "isError": False}, state)
            self.assertEqual(guard.on_stop(event, state), {})
            self.assertEqual(artifact.read_bytes(), original)
            research = root / "research.jsonl"
            guard.register(session, parent, "work-b", "collection", research, root, state, root)
            research.write_text('{"workId":"work-b"}\n')
            sha = hashlib.sha256(research.read_bytes()).hexdigest()
            with self.assertRaises(ValueError):
                guard.acknowledge(session, "0" * 64, {"threadId": parent}, state)
            guard.acknowledge(session, sha, {"threadId": parent}, state)
            self.assertEqual(guard.on_stop(event, state), {})
            research.write_text('{"workId":"wrong"}\n')
            with self.assertRaises(ValueError):
                guard.on_stop(event, state)


if __name__ == "__main__":
    unittest.main()
