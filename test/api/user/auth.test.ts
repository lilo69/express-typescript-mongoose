import request from 'supertest';
import routes from '../../../src/app';

describe('POST /login', () => {
  it('should return error when email or password not right', (done) => {
    return request(routes)
      .post('/api/v1/webapp/user/login')
      .send({ username: 'john@me.com', password: '1234' })
      .set('Accept', 'application/json')
      .expect(
        400,
        {
          code: '02',
          message: 'Email or password not right',
        },
        done
      );
  });

  it('should return error when email invalid', (done) => {
    return request(routes)
      .post('/api/v1/webapp/user/login')
      .send({ username: 'john@.com', password: '1234' })
      .set('Accept', 'application/json')
      .expect(
        400,
        {
          code: '01',
          message: 'Email invalid',
        },
        done
      );
  });
});

describe('POST /register', () => {
  it('should return error when email or password not right', (done) => {
    return request(routes)
      .post('/api/v1/webapp/user/login')
      .send({ username: 'john@me.com', password: '1234' })
      .set('Accept', 'application/json')
      .expect(
        400,
        {
          code: '02',
          message: 'Email or password not right',
        },
        done
      );
  });

  it('should return error when email invalid', (done) => {
    return request(routes)
      .post('/api/v1/webapp/user/login')
      .send({ username: 'john@.com', password: '1234' })
      .set('Accept', 'application/json')
      .expect(
        400,
        {
          code: '01',
          message: 'Email invalid',
        },
        done
      );
  });
});
