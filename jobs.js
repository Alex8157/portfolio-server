module.exports = {
	prices: () => {
		const number = Math.random() * 100;
		return {
			sell: Math.floor(number * 999) / 1000,
			buy: Math.floor(number * 1001) / 1000,
		};
	},
};

// Каждый метод будет вызываться один раз в интервал, результат вызова метода будет разослан всем клиентам с помощью функции broadcast.
// Пример рассылки: {"jsonrpc":"2.0","method":"prices","params":{"sell":32.038,"buy":32.102}}
