const statuses = ["Active", "Cancelled", "Filled", "Rejected"];
let id = 0;

module.exports = {
	transaction: async (params, broadcast) => {
		const creationTime = new Date();
		const changeTime = new Date();
		const status = statuses[Math.floor(Math.random() * statuses.length)];
		const result = { ...params, id: id++, creationTime, changeTime, status };
		broadcast("transaction", result);
	},
};

// params - содержит параметры с которым был вызван метод
// broadcast рассылает всем клиентам сообщение, название метода передаётся первым параметром, данные вторым.
// пример того, что отправит broadcast если метод будет вызван сообщением {"jsonrpc":"2.0","method":"transaction","params":{"foo":"foo","bar":"baz"}} результат: {"jsonrpc":"2.0","method":"transaction","params":{"foo":"foo","bar":"baz","id":0,"creationTime":"2023-03-26T12:46:50.058Z","changeTime":"2023-03-26T12:46:50.058Z","status":"Filled"}}
