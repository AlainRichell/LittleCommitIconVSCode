const vscode = require('vscode');

const COMMITS_CONTAINER = 'workbench.view.extension.littleCommitIconCommits';
const CHANGES_VIEW = 'workbench.scm';
const ANCHOR_VIEW = 'littleCommitIconAnchor';

/**
 * VS Code exposes no public API to move a view into another view container, so the workbench internal
 * `vscode.moveViews` command does the move. It is idempotent (a view already in the destination container is a
 * no-op), which makes it safe to call on every activation: the layout heals itself after a view location reset.
 */
async function moveCommitsToOwnContainer() {
	try {
		await vscode.commands.executeCommand('vscode.moveViews', {
			viewIds: [CHANGES_VIEW],
			destinationId: COMMITS_CONTAINER
		});
	} catch (error) {
		vscode.window.showErrorMessage(
			`Little Commit Icon: the commits view could not be moved automatically (${error && error.message ? error.message : error}). ` +
			'Move it by hand: right click on the "Changes" view title > Move View... and pick the Source Control item with the commit icon.'
		);
	}
}

function activate(context) {
	// Empty, collapsed and never toggled off: it only exists so the commits container keeps its own icon.
	context.subscriptions.push(
		vscode.window.registerTreeDataProvider(ANCHOR_VIEW, {
			getChildren: () => [],
			getTreeItem: (element) => element
		})
	);

	moveCommitsToOwnContainer();
}

function deactivate() { }

module.exports = { activate, deactivate };
