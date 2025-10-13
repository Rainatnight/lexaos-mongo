import mongoose, { Schema } from 'mongoose'

import { REGEXP_EMAIL, validateEmail } from '@helpers/validator/validateEmail'

import { UserType } from './Users.type'

const UserSchema = new Schema(
  {
    _id: Schema.Types.String,
    verified: {
      email: { type: Boolean, default: false },
      phone: { type: Boolean, default: false },
    },
    roles: {
      type: Schema.Types.Array,
      ref: 'Roles',
      required: true,
      default: ['unconfirmed'],
    },
    profile: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      surname: {
        type: Schema.Types.String,
        trim: true,
      },
      birthdate: { type: String },
      gender: {
        type: Schema.Types.String,
        enum: ['male', 'female'],
      },
      workplace: {
        type: String,
        trim: true,
      },
      position: {
        type: String,
        trim: true,
      },
      education: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, '"can\'t be blank"'],
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [REGEXP_EMAIL, 'Please fill a valid email address'],
      },
      phone: { type: Schema.Types.String },
      password: { type: Schema.Types.String },
      image: { type: Schema.Types.String },
    },
    services: {
      kinescopeFolderId: {
        type: String,
        default: null,
      },
      password: { type: String, default: null },
      passwordResetToken: { type: Schema.Types.String, required: false },
    },
    lastVisit: {
      type: Schema.Types.Number,
      set: (date: number) => new Date(date * 1000),
    },
    updatedAt: { type: Schema.Types.Number },
    createdAt: { type: Schema.Types.Number },
  },
  { timestamps: true, collection: 'users' }
)

export default mongoose.model<UserType & mongoose.Document>('Users', UserSchema)
