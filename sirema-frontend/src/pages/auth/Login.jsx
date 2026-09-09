import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/endpoints/auth.js';

const schema = z.object({
  nombreUsuario: z.string().email(),
  clave: z.string().min(1, 'Requerido'),
});

export function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    await login(data.nombreUsuario, data.clave);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('nombreUsuario')} placeholder="Correo institucional" />
      {errors.nombreUsuario && <p>{errors.nombreUsuario.message}</p>}

      <input {...register('clave')} type="password" placeholder="Clave" />
      {errors.clave && <p>{errors.clave.message}</p>}

      <button type="submit">Ingresar</button>
    </form>
  );
}
