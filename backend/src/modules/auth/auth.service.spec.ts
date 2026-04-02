import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Role } from '../../common/enums/role.enum';

const mockUser = {
  id: 'uuid-1',
  email: 'joao@example.com',
  name: 'João Silva',
  role: Role.CITIZEN,
  sector: null,
};

const mockUsersService = {
  create: jest.fn(),
  findByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
};

describe('AuthService - register', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('deve criar uma conta com sucesso e retornar access_token e dados do usuário', async () => {
    mockUsersService.create.mockResolvedValueOnce(mockUser);

    const result = await service.register({
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
    });

    expect(mockUsersService.create).toHaveBeenCalledWith({
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
      role: Role.CITIZEN,
    });

    expect(result).toHaveProperty('access_token', 'mock-token');
    expect(result.user).toMatchObject({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
    });
  });

  it('deve lançar ConflictException quando o e-mail já está em uso', async () => {
    mockUsersService.create.mockRejectedValueOnce(
      new ConflictException('E-mail já está em uso'),
    );

    await expect(
      service.register({
        name: 'Maria Souza',
        email: 'joao@example.com',
        password: 'outrasenha',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('deve cadastrar o usuário com a role CITIZEN por padrão', async () => {
    mockUsersService.create.mockResolvedValueOnce({ ...mockUser });

    await service.register({
      name: 'Carlos Lima',
      email: 'carlos@example.com',
      password: 'senha456',
    });

    const callArgs = mockUsersService.create.mock.calls[0][0];
    expect(callArgs.role).toBe(Role.CITIZEN);
  });

  it('deve gerar um JWT após o cadastro bem-sucedido', async () => {
    mockUsersService.create.mockResolvedValueOnce(mockUser);

    await service.register({
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
    });

    expect(mockJwtService.sign).toHaveBeenCalledWith({
      email: mockUser.email,
      sub: mockUser.id,
      role: mockUser.role,
    });
  });
});
