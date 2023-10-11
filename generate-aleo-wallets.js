const count = 20;
const allWallets = [];

const generateAleoWallets = async () => {
  const generateButton = document.querySelector('.ant-btn.ant-btn-primary.ant-btn-lg');

  if (!generateButton) {
    console.log('Кнопка не найдена');
  } else {
    for (let i = 0; i < count; i++) {
      await generateButton.click();
      await new Promise(resolve => setTimeout(resolve, 100));

      const inputElements = document.querySelectorAll('.ant-input.ant-input-disabled.ant-input-lg');
      if (inputElements.length > 0) {
        const walletData = Array.from(inputElements).map((inputElement) => inputElement.value).join(',');

        console.log(walletData);
        allWallets.push(walletData);
      } else {
        console.log('Элементы с указанными классами не найдены');
      }
    }

    console.log(allWallets);
  }
}

generateAleoWallets()
