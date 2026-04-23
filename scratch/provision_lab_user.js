const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

async function provision() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const user = await User.findOne({ email: 'sulakshanasalunke85@gmail.com' });
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        // Valid dummy RSA Private Key for development
        const dummyKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA74bCNe/jgYMzNQ25/oijFOp5etYZvObrKJOIGQEW8lgCHtom
rNBLFtk3DcI3TN4II9vGCcKSa0WctoQP8jdcS3/SMcsRFneeU7fbW0waR0KXM+wm
DsAs309NeS8hyjB29CCim2QXektlS3/pX+dgtyRTbdbAAP/lsoZFxWwu3lwKBgQDv
hsI17+OBgzM1Dbn+oijFOp5etYZvObrKJOIGQEW8lgCHtomrNBLFtk3DcI3TN4II
9vGCcKSa0WctoQP8jdcS3/SMcsRFneeU7fbW0waR0KXM+wmDsAs309NeS8hyjB29
CCim2QXektlS3/pX+dgtyRTbdbAAP/lsoZFxWwu3lwKBgQDLbqHt7kFMMRykXT2J
LvAYk+QpyvpBIEp2UpF6hdxp8l7FGktsCITv2KITIWmKFlhzLNZZsIUUnzUim86G
H99Gfp27QYlYiQC4gOVAPfbPTAZ+khyjsx0fEoGrSrTQ1sKr8UQAQLuOmTHCGhsf
4IDcixlPNLTOn4FGjfYyYeKUBwKBgQDpNfrnyx5mnhiAglHik35Asdc6fWFb8Ahn
Aswyq+d6O05e1KJr17KjX+GM9YyQ5w2rrsvsZcJOnq3n5krcXjnWvcj76k4hPiIZ
hiv8c9CErnKQBqf32LLDc3Hr8LtElBnsUAJMmSc20yHXqA22FKOfyJWPK6HmTGO
Mmi7jAHODFwKBgC1QOVWMSpM0JVMfScOy5twypRICGnhDPxLYFXubMZuP1zhEQS
SRSTs7n+5u9NlDXPRaumxD+4C6bdWFqx0JIGzNa0j4siU8byKp42bJ5p4KKzAqT
6LPFN+E+ckz3M7f54DxPtpnkN+UlBbORdh14348paiU7ulPcjZLDNnwH84lAoGAC
cE/US6rAsh/4z4Ht3+GD9bKqzUsvGeEs35b20Yu7UT44BXGeeNCP4rIHVSYUP+4j
jZI2uyndfkjsjKuL1EE33FW2S1c3lYz05Wcxr8wATvXClFi7CN6/I7k0FC0ZMd9
ECbTAegRl33m8/PgVFZsz2vk1d0ponWs1OqBuKA1Ihc=
-----END PRIVATE KEY-----`;

        user.fabricIdentity = {
            certificate: 'PLACEHOLDER_CERT',
            privateKey: dummyKey,
            mspId: process.env.FABRIC_MSP_LAB || 'u1hpn7jii5'
        };

        await user.save();
        console.log('Successfully provisioned Fabric Identity for Tanu Salunke');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}
provision();
