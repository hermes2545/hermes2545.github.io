import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from cms_backend import publish


class FakeGitHubTransport:
    def __init__(self):
        self.calls = []
        self.responses = []

    def queue(self, payload):
        self.responses.append(payload)

    def __call__(self, method, path, token, payload=None):
        self.calls.append({"method": method, "path": path, "token": token, "payload": payload})
        if not self.responses:
            raise AssertionError(f"unexpected request: {method} {path}")
        return self.responses.pop(0)


class CmsPublishTests(unittest.TestCase):
    def test_create_single_commit_from_changed_paths_and_update_main_ref(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            (repo / "data").mkdir()
            (repo / "data" / "books.json").write_text("[]\n", encoding="utf-8")
            (repo / "index.html").write_text("<html>ok</html>", encoding="utf-8")
            fake = FakeGitHubTransport()
            fake.queue({"tree": {"sha": "base-tree"}})
            fake.queue({"sha": "blob-books"})
            fake.queue({"sha": "blob-index"})
            fake.queue({"sha": "new-tree"})
            fake.queue({"sha": "new-commit"})
            fake.queue({"ref": "refs/heads/main", "object": {"sha": "new-commit"}})

            result = publish.publish_changed_paths(
                repo,
                changed_paths=[Path("data/books.json"), Path("index.html")],
                token="gho_testtoken",
                owner="hermes2545",
                repo_name="hermes2545.github.io",
                branch="main",
                base_sha="base-commit",
                message="CMS publish reading book",
                transport=fake,
            )

        self.assertEqual(result.commit_sha, "new-commit")
        self.assertEqual(result.changed_paths, ["data/books.json", "index.html"])
        self.assertEqual(fake.calls[0]["path"], "/repos/hermes2545/hermes2545.github.io/git/commits/base-commit")
        self.assertEqual(fake.calls[1]["payload"]["encoding"], "base64")
        self.assertEqual(fake.calls[3]["payload"]["base_tree"], "base-tree")
        self.assertEqual(fake.calls[3]["payload"]["tree"], [
            {"path": "data/books.json", "mode": "100644", "type": "blob", "sha": "blob-books"},
            {"path": "index.html", "mode": "100644", "type": "blob", "sha": "blob-index"},
        ])
        self.assertEqual(fake.calls[4]["payload"]["parents"], ["base-commit"])
        self.assertEqual(fake.calls[5]["method"], "PATCH")
        self.assertEqual(fake.calls[5]["path"], "/repos/hermes2545/hermes2545.github.io/git/refs/heads/main")
        self.assertEqual(fake.calls[5]["payload"], {"sha": "new-commit", "force": False})

    def test_publish_rejects_paths_outside_repository(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            with self.assertRaises(publish.PublishError):
                publish.publish_changed_paths(
                    repo,
                    changed_paths=[Path("../secret.txt")],
                    token="gho_testtoken",
                    owner="hermes2545",
                    repo_name="hermes2545.github.io",
                    branch="main",
                    base_sha="base-commit",
                    message="bad",
                    transport=FakeGitHubTransport(),
                )

    def test_github_token_provider_can_use_gh_cli_without_printing_token(self):
        with mock.patch.dict("os.environ", {}, clear=True), mock.patch("subprocess.run") as run:
            run.return_value = mock.Mock(returncode=0, stdout="gho_from_cli\n", stderr="")

            self.assertEqual(publish.github_token_from_env(), "gho_from_cli")

        run.assert_called_once()
        args = run.call_args.args[0]
        self.assertEqual(args, ["gh", "auth", "token"])
        self.assertTrue(run.call_args.kwargs["capture_output"])


if __name__ == "__main__":
    unittest.main()
