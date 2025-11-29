use pkcs1::{EncodeRsaPrivateKey, EncodeRsaPublicKey};
use pkcs8::{EncodePrivateKey, EncodePublicKey};
use rsa::RsaPrivateKey;

pub enum KeyFormat {
    Pkcs1,
    Pkcs8,
}

pub fn generate_key_pair(key_format: KeyFormat) {
    match key_format {
        KeyFormat::Pkcs1 => {
            let mut bits = [0u8; 2048];
        }
        KeyFormat::Pkcs8 => todo!(),
    }
}

#[test]
fn foo() {
    let mut rng = rand::thread_rng();
    let private_key = RsaPrivateKey::new(&mut rng, 2048).unwrap();
    let public_key = private_key.to_public_key();
    let pem = private_key.to_pkcs1_pem(pkcs1::LineEnding::CRLF).unwrap();
    println!("{}", pem.as_str());

    let pem = private_key.to_pkcs8_pem(pkcs8::LineEnding::CRLF).unwrap();
    println!("{}", pem.as_str());

    let pem = private_key
        .to_pkcs8_encrypted_pem(&mut rng, b"password", pkcs8::LineEnding::CRLF)
        .unwrap();
    println!("{}", pem.as_str());

    let pem = public_key.to_pkcs1_pem(pkcs1::LineEnding::CRLF).unwrap();
    println!("{}", pem.as_str());
}
