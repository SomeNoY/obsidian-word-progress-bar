import { App, PluginSettingTab, Setting } from "obsidian";
import WordGoalPlugin from "./main";

export interface WordGoalSettings {
	toggleAllFiles: boolean;
	allFilesGoal: string;
}

export const DEFAULT_SETTINGS: WordGoalSettings = {
	toggleAllFiles: true,
	allFilesGoal: "100",
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
			.setName("Progress bar for all files")
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
			.setName("Words goal for all files")
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
	}
}
