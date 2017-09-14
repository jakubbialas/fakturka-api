import mongoose from 'mongoose';

const UserSettingDef = {
    key: String,
    value: String
};

const userSettingSchema = mongoose.Schema(UserSettingDef, {timestamps: true});
const UserSetting = mongoose.model('UserSetting', userSettingSchema);

export {UserSetting, UserSettingDef};