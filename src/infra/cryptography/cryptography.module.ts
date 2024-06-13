import { Module } from "@nestjs/common";
import { JwtEncrypter } from "./jwt-encrypter";
import { BcryptHasher } from "./bcrypt-hasher";
import { Encrypter } from "@/domain/forum/application/cryptography/encrypter";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { HashComparer } from "@/domain/forum/application/cryptography/hash-comparer";

@Module({
  providers: [
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: Encrypter, useClass: JwtEncrypter },
  ],
  exports: [HashGenerator, HashComparer, Encrypter],
})
export class CryptographyModule {}
