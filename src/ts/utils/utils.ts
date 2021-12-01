import { AlgoNames } from "../enums/enums";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const toggleNotificationBySelect = (
  selectId: string,
  notificationId: string
) => {
  const selectElement: HTMLSelectElement = document.querySelector(
    `#${selectId}`
  );
  const value: AlgoNames = selectElement.options[selectElement.selectedIndex]
    .value as AlgoNames;
  if (value == AlgoNames.QUICK || value == AlgoNames.QUICK3) {
    document
      .querySelector(`#${notificationId}`)
      .classList.remove("is-invisible");
    return;
  }
  document.querySelector(`#${notificationId}`).classList.add("is-invisible");
};
