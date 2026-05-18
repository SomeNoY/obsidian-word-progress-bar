import { Plugin, MarkdownView, TFile } from "obsidian";
import { DEFAULT_SETTINGS, WordGoalSettings, MySettingTab } from "./settings";
import { ProgressBar } from "./pb";

export default class WordGoalPlugin extends Plugin {
	settings!: WordGoalSettings;

	private pb!: ProgressBar;

	// Can be not really correct as core plugin
	private countWords(text: string): number {
		const withoutFrontmatter = text.replace(/^---[\s\S]*?---\n?/, "");
		const plain = withoutFrontmatter
			.replace(/```[\s\S]*?```/g, "") // code blocks
			.replace(/`[^`]*`/g, "") // inline code
			.replace(/!\[.*?\]\(.*?\)/g, "") // images
			.replace(/\[.*?\]\(.*?\)/g, "$1") // links
			.replace(/[#*_~>|-]+/g, " ") // markdown symbols
			.trim();

		if (!plain) return 0;
		return plain.split(/\s+/).filter((w) => w.length > 0).length;
	}

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new MySettingTab(this.app, this));

		this.pb = new ProgressBar(this.addStatusBarItem());

		this.app.workspace.on("active-leaf-change", () => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			const file = this.app.workspace.getActiveFile();

			if (!file) {
				this.pb.hide();
				return;
			}

			const goal = this.getGoalForFile(file, this.settings.toggleAllFiles);
			if (goal === null) {
				this.pb.hide();
				return;
			}

			this.pb.show();

			if (view) {
				this.pb.update(
					this.countWords(view.editor.getValue()),
					goal,
				);
			}
		});

		this.app.workspace.on("editor-change", (editor) => {
			const file = this.app.workspace.getActiveFile();
			if (!file) {
				this.pb.hide();
				return;
			}

			const goal = this.getGoalForFile(file, this.settings.toggleAllFiles);
			if (goal === null) {
				this.pb.hide();
				return;
			}

			this.pb.show();

			this.pb.update(
				this.countWords(editor.getValue()),
				goal,
			);
		});
	}

	private getGoalForFile(file: TFile, useDefault: boolean): number | null {
		const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
		const fileGoal: unknown = frontmatter?.[this.settings.frontmatterKey];

		if (typeof fileGoal === "number" && fileGoal > 0) {
			return fileGoal;
		}

		if (typeof fileGoal === "string") {
			const n = parseInt(fileGoal);
			if (!isNaN(n) && n > 0) return n;
		}

		if (!useDefault) return null;

		const globalGoal = parseInt(this.settings.allFilesGoal);
		if (!isNaN(globalGoal) && globalGoal > 0) {
			return globalGoal;
		}

		return null;
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<WordGoalSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
