const UserService = require('../services/user');

module.exports = {
getCurrentUser: async (req, res) => {
  try {
    const user = await UserService.findByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const { password, ...safeUser } = user;
    res.json(safeUser);

  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
},
getUserData : async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await UserService.getUserById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json({
            id: user.id,
            fio: user.fio,
            phone: user.phone,
            email: user.email,
            paymentMethod: user.payment_method,
            age: user.age,
            pasport: user.pasport,
            v_u: user.v_u,
            rent_count: user.rent_count,
            error_count: user.error_count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
},

updatePhone : async (req, res) => {
    try {
        const userId = req.user.userId;
        const { phone } = req.body;
        const updatedUser = await UserService.updatePhone(userId, phone);
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка обновления номера телефона' });
    }
},

updateEmail : async (req, res) => {
    try {
        const userId = req.user.userId;
        const { email } = req.body;

        const updatedUser = await UserService.updateEmail(userId, email);
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка обновления email' });
    }
},

updatePaymentMethod : async (req, res) => {
    try {
        const userId = req.user.userId;
        const { paymentMethod } = req.body;

        const updatedUser = await UserService.updatePaymentMethod(userId, paymentMethod);
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка обновления способа оплаты' });
    }
},

deleteAccount : async (req, res) => {
    try {
        const userId = req.user.userId;
        await UserService.deleteAccount(userId);
        res.json({ message: 'Аккаунт успешно удален' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка удаления аккаунта' });
    }
}
}