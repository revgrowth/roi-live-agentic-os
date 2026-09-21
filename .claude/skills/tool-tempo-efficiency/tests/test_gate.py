import tempfile
import unittest
from pathlib import Path

from tempo_efficiency.config import BOT_EXEC_ENABLED, GATE_OFF_NAME, GATE_ON_NAME
from tempo_efficiency.gate import apply_path_permitted, bot_exec_is_off, resolve_gate, write_enabled_off, write_enabled_on


class GateTests(unittest.TestCase):
    def test_absent_is_dry_run(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            state = resolve_gate(root)
            self.assertEqual(state.gate, "absent")
            self.assertFalse(state.apply_allowed)
            self.assertEqual(state.phase, "dry-run")
            self.assertFalse(apply_path_permitted(root))

    def test_enabled_on_allows_apply(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_enabled_on(root)
            state = resolve_gate(root)
            self.assertEqual(state.gate, "ENABLED.on")
            self.assertTrue(state.apply_allowed)
            self.assertEqual(state.phase, "apply")
            self.assertTrue((root / GATE_ON_NAME).is_file())

    def test_enabled_off_forces_dry_run(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_enabled_off(root, reason="operator")
            state = resolve_gate(root)
            self.assertEqual(state.gate, "ENABLED.off")
            self.assertFalse(state.apply_allowed)
            self.assertEqual(state.phase, "dry-run")
            self.assertTrue((root / GATE_OFF_NAME).is_file())

    def test_conflict_disables_and_alerts(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_enabled_on(root)
            write_enabled_off(root)
            state = resolve_gate(root)
            self.assertEqual(state.gate, "conflict")
            self.assertFalse(state.apply_allowed)
            self.assertEqual(state.phase, "dry-run")
            self.assertIsNotNone(state.alert)

    def test_bot_exec_stays_off(self):
        self.assertFalse(BOT_EXEC_ENABLED)
        self.assertTrue(bot_exec_is_off())


if __name__ == "__main__":
    unittest.main()
