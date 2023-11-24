import {getRandomMotivationText} from "./motivates";

export function typeAndClearMessage(message: string, delay: number, delayClear?: number, waiteBeforeClear:number = 0): Promise<void> {
  return new Promise<void>((resolve) => {
    const messageElement = document.getElementById("message"); // Replace "message" with the ID of your message container

    async function typeText(index: number) {
      if (!messageElement) {
        return;
      }
      if (index <= message.length) {
        messageElement.innerHTML = message.substring(0, index);
        await new Promise((resolve) => setTimeout(resolve, delay));
        await typeText(index + 1);
      } else {
        setTimeout(() => {
          clearText(index);
        }, waiteBeforeClear)
      }
    }

    async function clearText(index: number) {
      if (!messageElement) {
        return;
      }
      if (index >= 0) {
        messageElement.innerHTML = message.substring(0, index);
        await new Promise((resolve) => setTimeout(resolve, delayClear ?? delay));
        await clearText(index - 1);
      } else {
        resolve();
      }
    }

    typeText(0).then();
  });
}

export function initMessageWithAutoUpdate() {
  setTimeout(() => {

    typeAndClearMessage(getRandomMotivationText(), 70, 35, 600_000).then(() => {
      initMessageWithAutoUpdate();
    });

  }, 250);
}
