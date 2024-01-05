export const regexTest = (name, value) => {
    const regexes = {
        nullable: /./,
        anything: /.+/,
        name: /^[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\d\s_'-]+$/,
        email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        phone: /^\d{10,11}$/,
        password:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        id_card: /(^\d{9}$|^\d{12}$)/,
        address: /^[^,]+$/,
        bio: /.+/,
        level: /^[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\d\s_'-]+$/,
    };

    return regexes[name].test(value);
};

export const numberTest = (name, value) => {
    const numberValidator = {
        positive: value !== '' && value > 0,
        negative: value !== '' && value < 0,
        zero: value !== '' && value == 0,
        zeroTo100: value !== '' && value >= 0 && value <= 100,
        oneTo5: value !== '' && value >= 1 && value <= 5,
    };

    return numberValidator[name];
};
