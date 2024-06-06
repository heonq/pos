import { Link, useNavigate } from 'react-router-dom';
import { Wrapper, Form, Input, Title, Error, Switcher } from '../components/auth-components';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';
import { setData } from '../utils/fetchFunctions';

export default function CreateAccount() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isLoading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'passwordCheck') setPasswordCheck(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || password === '' || passwordCheck === '' || email === '') return;
    if (password !== passwordCheck) return setError('비밀번호가 일치하지 않습니다.');
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      const uid = auth.currentUser?.uid;
      if (uid) setData({ uid, data: [{ name: '카테고리없음', number: 1, display: true }] });
      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError) setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>회원가입</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          type="email"
          value={email}
          placeholder="이메일 주소를 입력해주세요."
          required
        />
        <Input
          onChange={onChange}
          name="password"
          type="password"
          value={password}
          placeholder="비밀번호를 입력해주세요."
          required
        />
        <Input
          onChange={onChange}
          name="passwordCheck"
          type="password"
          value={passwordCheck}
          placeholder="비밀번호를 한번 더 입력해주세요."
          required
        />
        <Input type="submit" value={isLoading ? '가입중...' : '가입하기'} />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        이미 계정이 있어요.
        <Link to="/login">로그인 &rarr;</Link>
      </Switcher>
      <Switcher>
        비밀번호를 잊어버렸어요.
        <Link to="/reset-password"> 비밀번호 재설정하기 &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
