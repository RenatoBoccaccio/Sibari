export default {
	createHash:(password) => {
		return dcodeIO.bcrypt.hashSync(password , 10);
	},
	verifyHash: (password , hash) => {
		return dcodeIO.bcrypt.compareSync(password , hash);
	},
	createToken: (email) => {
		return jsonwebtoken.sign({email}, 'secret', {expiresIn: 60*60});
	},
	
	iscriviti: () => {
		const nome = name_su.text;
		const password = password_su.text;
		const tipo = tipo_su.selectedOptionValue;

		const pHash = this.createHash(password);
		return signup.run({nome, pHash, tipo})
			.then(() => showAlert('Account creato !', 'success'))
			.then(() =>'token', storeValue(this.createToken(name)))
			.then(() => navigateTo('MainPage'))
			.catch(e => showAlert(e.message, 'errore'));
	},
	signIn: async () => {
		const nome = name_si.text;
		const password = password_si.text;
		
		const [user] = await finduser.run({nome});
		
		if(user && this.verifyHash(password, user?.password)){
			if(user?.tipo == 'Admin'){
				navigateTo('MainPage')
			} else {
				navigateTo('ReadPage')
			}
		} else {
			showAlert('Nome o password non corretti', 'error');
		}
	}
}