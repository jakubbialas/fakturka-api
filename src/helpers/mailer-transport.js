'use strict';

import * as nodemailer from 'nodemailer';
import * as mailConfig from '../../config/mail.json';

var transport = nodemailer.createTransport(mailConfig);
transport.sender = mailConfig.sender;

export {transport as Mailer};