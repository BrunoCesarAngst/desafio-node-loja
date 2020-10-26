import { Admin } from '@src/models/admin';
import AuthService from '@src/services/auth';
describe('Admin functional tests', () => {
  beforeEach(async () => {
    await Admin.deleteMany({});
  });
  describe('When creating a new admin', () => {
    it('should successfully create a new admin with encrypted password', async () => {
      const newAdmin = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      const response = await global.testRequest.post('/admin').send(newAdmin);
      expect(response.status).toBe(201);
      await expect(
        AuthService.comparePassword(newAdmin.password, response.body.password)
      ).resolves.toBeTruthy();
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newAdmin,
          ...{ password: expect.any(String) },
        })
      );
    });

    it('Should return 422 when there is a validation error', async () => {
      const newAdmin = {
        email: 'john@mail.com',
        password: '1234',
      };
      const response = await global.testRequest.post('/admin').send(newAdmin);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Admin validation failed: name: Path `name` is required.',
      });
    });

    it('Should return 409 when the email already exists', async () => {
      const newAdmin = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      await global.testRequest.post('/admin').send(newAdmin);
      const response = await global.testRequest.post('/admin').send(newAdmin);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'Admin validation failed: email: already exists in the database.',
      });
    });
  });

  describe('when authenticating a admin', () => {
    it('should generate a token for a valid admin', async () => {
      const newAdmin = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      await new Admin(newAdmin).save();
      const response = await global.testRequest
        .post('/admin/authenticate')
        .send({ email: newAdmin.email, password: newAdmin.password });

      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      );
    });

    it('Should return UNAUTHORIZED if the admin with the given email is not found', async () => {
      const response = await global.testRequest
        .post('/admin/authenticate')
        .send({ email: 'some-email@mail.com', password: '1234' });

      expect(response.status).toBe(401);
    });

    it('Should return UNAUTHORIZED if the admin is found but the password does not match', async () => {
      const newAdmin = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      await new Admin(newAdmin).save();
      const response = await global.testRequest
        .post('/admin/authenticate')
        .send({ email: newAdmin.email, password: 'different password' });

      expect(response.status).toBe(401);
    });
  });
});
