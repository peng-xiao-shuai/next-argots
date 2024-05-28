export enum SETTING_KEYS {
  MODE_AUTO = 'mode_auto',

  CHOOSE_MANUALLY = 'Choose_manually',
  LIGHT_MODE = 'Light_Mode',
  DARK_MODE = 'Dark_Mode',
  CHAT1 = 'chat1',
  CHAT2 = 'chat2',
  MODE_SWITCH = 'mode_switch',
  SIZE_DEFAULT = 'size_default',

  FONT_PREVIEW = 'Font_preview',

  E_MAIL = 'e-mail',
  E_MAIL_OPTIONAL = 'e-mail_optional',
  PLEASE_E_MAIL = 'please_e_mail',
  OPTIONAL = 'optional',
  FEEDBACK_TYPES = 'feedback_types',
  I_WANT_TO = 'i_want_to',
  ISSUE = 'issue',
  OPINION = 'opinion',
  CONTENT = 'content_feedback',
  E_MAIL_FORMAT_IS_INCORRECT = 'e-mail_format_is_incorrect',
  FEEDBACK_SUCCESS = 'Feedback_Success',
}

export enum HOME_KEYS {
  SELECT_ROOM = 'Select_channel',
  CREATE_ROOM = 'Create_channel',
  ROOM_NUMBER = 'channel_number',
  NICKNAME = 'Nickname',
  PASSWORD = 'channel_password',
  PLEASE_INPUT = 'Please_input',

  HOME_API = 'Home_Api_Tip',
  NO_ROOM_NAME = 'Sorry_~_channel_name_not_exists!',
  ROOM_NAME = 'Sorry_~_channel_name_already_exists!',
  PASSWORD_ERROR = 'Password_error',
  EMPTY_NICKNAME = 'Please_input_nickname_as_your_room_nickname',
  EMPTY_PASSWORD = 'Please_input_room_password_enter_the_room',
  EMPTY_ROOM_NUMBER = 'Please_input_room_number_nickname_enter_the_room',
  AVATAR = 'avatar',
}

export enum CHAT_ROOM_KEYS {
  SEND = 'Send',
  MEMBER_ADDED = 'Member_added',
  MEMBER_REMOVED = 'Member_removed',
  OWNER_MEMBER_REMOVED = 'Owner_member_removed',
  HOUSE_OWNER = 'House_owner',

  DECRYPTION_FAILURE = 'Decryption_failure',
  CONTENT_CANNOT_BE_EMPTY = 'Content_cannot_be_empty',

  SPEAK_OUT_FREELY = 'Speak_out_freely',

  // 未连接频道
  UNCONNECTED_CHANNEL = 'Unconnected_channel',

  NO_NICKNAME = 'No_nickname',
  NAME_EXISTS = 'The_user_name_already_exists',
  // 每个邀请链接只能邀请一个用户，邀请成功之后无效
  INVITATION_DESCRIPTION = 'Invitation_description',
  // 查看生成链接
  LOOK_LINKS = 'View_build_link',
  // 生成邀请地址
  CREATE_INVITE = 'Generate_invite_address',
}

export enum COMMON_KEYS {
  PACKAGE_NAME = 'argots',

  HOME = 'Home',
  CHAT = 'Chat',
  SETTINGS = 'Settings',
  DARK_PATTERN = 'Dark_pattern',
  TEXT_SIZE = 'Text_Size',
  MULTI_LANGUAGE = 'Multi_language',
  ABOUT = 'About',
  FEEDBACK = 'Feedback',
  CHECK_FOR_UPDATES = 'Check_for_updates',
  PRIVACY_POLICY = 'Privacy_policy',
  'E-MAIL_CONTACT' = 'E-mail_contact',

  CLOSE = 'Close',
  OPEN = 'Open',
  CONFIRM = 'Confirm',
  COMPLETE = 'Complete',
  SUCCESSFULLY_SET = 'Successfully_set',

  SHARE = 'Share',
  NO_DATA = 'No_Data',
}

export enum API_KEYS {
  PUSHER_AUTH_401 = 'Incorrect_password',
  PUSHER_AUTH_400 = 'Parameter_missing',
  PUSHER_AUTH_403 = 'Access_denied',
  PUSHER_AUTH_423 = 'Channel_already_exists,_please_try_another',
  PUSHER_AUTH_500 = 'Unknown_error',
}

export enum META {
  DESC = 'meta_desc',
  KEYWORDS = 'meta_keywords',
}
