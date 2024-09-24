import { UserController } from "../../src/controllers/user/UserController";
import { AppDataSource } from "../../src/database/data-source";
import { User } from "../../src/database/entity/User";
import { Role } from "../../src/database/entity/Role";
import { CreateUserDto, UpdateUserDto } from "../../src/dto/user.dto";
import { hashPassword } from "../../src/utils/hashPassword";

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));
jest.mock("../../src/utils/hashPassword");

describe("UserController", () => {
  let userController: UserController;
  let userRepository: jest.Mocked<any>;
  let roleRepository: jest.Mocked<any>;

  beforeEach(() => {
    userController = new UserController();
    userRepository = {
      save: jest.fn(),
      findOneOrFail: jest.fn(),
    };
    roleRepository = {
      findOneOrFail: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === User) return userRepository;
      if (entity === Role) return userRepository;
    });
  });

  afterEach(() => {
    jest.clearAllMocks;
  });

  it("should create a user", async () => {
    const createUserDto: CreateUserDto = {
      firstName: "Mihai",
      lastName: "Barascu",
      email: "mihai.barascu@yahoo.com",
      password: "password",
    };

    const hashedPassword = "hashedPassowrd";
    (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);

    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.password = hashedPassword;

    userRepository.save.mockResolvedValue(user);

    const result = await userController.createUser(createUserDto);

    expect(result.firstName).toBe(createUserDto.firstName);
    expect(result.lastName).toBe(createUserDto.lastName);
    expect(result.email).toBe(createUserDto.email);
    expect(result.password).toBe(hashedPassword);
  });
});

