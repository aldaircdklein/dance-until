import React from 'react';

//import { useAuth } from '@/presentation/shared/context/auth';
//import { useLoading } from '@/presentation/shared/context/loading';

import AppRoutes from './AppRoutes';
import AuthRoutes from './AuthRoutes';

const Routes = () => {
  //const { signed, loading } = useAuth();
  //const load = useLoading();
  /* if (loading) {
    load.open();
  }
  load.close(); */
  return true ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
