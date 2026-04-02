// ProgressBar.ts

export class ProgressBar {
	private container: HTMLElement;
	private label: HTMLSpanElement;
	private track: HTMLDivElement;
	private fill: HTMLDivElement;

	constructor(statusBarItem: HTMLElement) {
		// Корневой контейнер — тот самый элемент статус-бара
		this.container = statusBarItem;
		this.container.addClass("word-goal-status");

		// Текстовый лейбл: "250 / 500"
		this.label = this.container.createSpan({ cls: "word-goal-label" });

		// Трек (серый фон)
		this.track = this.container.createDiv({ cls: "word-goal-track" });

		// Заполнение (цветная полоса внутри трека)
		this.fill = this.track.createDiv({ cls: "word-goal-fill" });
	}

	// Обновить состояние: current — текущее кол-во слов, goal — цель
	update(current: number, goal: number): void {
		const progress = Math.min(current / goal, 1);
		const percent = Math.round(progress * 100);
		const done = progress >= 1;

		this.label.setText(`${current} / ${goal}`);
		this.fill.style.width = `${percent}%`;

		// Переключаем класс завершения — CSS сам разберётся с цветом
		this.fill.toggleClass("word-goal-fill--done", done);
		this.track.toggleClass("word-goal-track--done", done);
	}

	// Скрыть бар (когда нет активного файла или цели)
	hide(): void {
		this.container.setCssProps({ display: "none" });
	}

	show(): void {
		this.container.setCssProps({ display: "" });
	}
}
