export type ProfileType = {
  name: string
  surname?: string
  birthdate?: string
  gender: 'male' | 'female'
  workplace?: string
  position?: string
  education?: string
  email: string
  phone?: string
  password?: string
  image?: string
}

export type UserType = {
  _id: string
  verified: {
    email: boolean
    phone: boolean
  }
  roles: Array<string>
  profile: ProfileType

  services: {
    kinescopeFolderId?: string
    password?: string
    passwordResetToken?: string
  }

  lastVisit: number
  createdAt: number
  updatedAt: number
}
