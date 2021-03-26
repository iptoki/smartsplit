const users = [
	{
		_id: "admin",
		firstName: "System",
		lastName: "Admin",
		artistName: "SysAdmin",
		types: ["admin", "logistic"],
		emails: ["admin@allocentrique.com"],
		accountStatus: "active",
		password: PasswordUtil.hash("123")
	},
	{
		_id: "logistic",
		firstName: "Logistic",
		lastName: "Employee",
		artistName: "Log",
		types: ["logistic"],
		emails: ["logistic@allocentrique.com"],
		accountStatus: "active",
		password: PasswordUtil.hash("123")
	},
]
