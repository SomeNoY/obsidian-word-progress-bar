import { App, PluginSettingTab, Setting } from "obsidian";
import WordGoalPlugin from "./main";

export interface WordGoalSettings {
	toggleAllFiles: boolean;
	allFilesGoal: string;
	frontmatterKey: string;
}

export const DEFAULT_SETTINGS: WordGoalSettings = {
	toggleAllFiles: true,
	allFilesGoal: "100",
	frontmatterKey: "word-goal",
};

export class MySettingTab extends PluginSettingTab {
	plugin: WordGoalPlugin;

	constructor(app: App, plugin: WordGoalPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Use default word goal for all files")
			.setDesc("When off, the progress bar shows only on notes that have their own goal property")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.toggleAllFiles)
					.onChange(async (value) => {
						this.plugin.settings.toggleAllFiles = value;

						await this.plugin.saveSettings();

						this.display();
					}),
			);

		new Setting(containerEl)
			.setName("Default word goal")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.allFilesGoal)
					.onChange(async (value) => {
						const n = parseInt(value);
						if (!isNaN(n) && n > 0) {
							this.plugin.settings.allFilesGoal = String(n);
							await this.plugin.saveSettings();
						}
					})
					.inputEl.addEventListener("input", (e) => {
						const input = e.target as HTMLInputElement;

						input.value = input.value.replace(/\D/g, "");

						input.value = input.value.replace(/^0+/, "");
					}),
			);

		new Setting(containerEl)
			.setName("Frontmatter key for per-file goal")
			.setDesc("If this property exists in a note's frontmatter, its value is used as the word goal for that file")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.frontmatterKey)
					.onChange(async (value) => {
						if (value.length > 0) {
							this.plugin.settings.frontmatterKey = value;
							await this.plugin.saveSettings();
						}
					}),
			);
	}
}
