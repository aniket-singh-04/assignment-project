import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateStore() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/admin/stores', { replace: true });
  }, [navigate]);
  return null;
}
