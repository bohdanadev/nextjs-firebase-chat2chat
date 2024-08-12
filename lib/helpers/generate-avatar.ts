import { AvatarGenerator } from "random-avatar-generator";

export const generateRandomAvatar = () => {
  const generator = new AvatarGenerator();
  return generator.generateRandomAvatar();
};
