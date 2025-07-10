// AdvancedFormExample.tsx
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import createAdvancedHistoryStore from './advanced-history-store';
import HistoryControls from './HistoryControls';
import { toast } from 'react-toastify';

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

const formStore = createAdvancedHistoryStore<FormValues>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
});

const AdvancedFormExample = () => {
  const { present, commitState, undo, redo, canUndo, canRedo, past } = formStore();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: present,
  });
  
  const [isDirty, setIsDirty] = useState(false);

  // Sincronizar formulario con el estado del historial
  useEffect(() => {
    reset(present);
    setIsDirty(false);
  }, [present, reset]);

  // Manejar cambios con debounce
  useEffect(() => {
    const subscription = watch((value) => {
      setIsDirty(true);
      // Commit cambios menores con debounce
      const timer = setTimeout(() => {
        commitState(value as FormValues, 'minor');
      }, 300);
      
      return () => clearTimeout(timer);
    });
    
    return () => subscription.unsubscribe();
  }, [watch, commitState]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Commit como cambio mayor al enviar
    commitState(data, 'major');
    toast.success('Formulario enviado correctamente');
  };

  return (
    <div className="form-container">
      <h2>Formulario Complejo con Historial</h2>
      
      <HistoryControls
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        currentHistorySize={past.length}
      />
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Username</label>
          <input
            {...register('username', { required: 'Required' })}
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <span className="error-message">{errors.username.message}</span>}
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            {...register('email', { 
              required: 'Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email.message}</span>}
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            {...register('password', { 
              required: 'Required',
              minLength: {
                value: 8,
                message: 'Minimum 8 characters',
              },
            })}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-message">{errors.password.message}</span>}
        </div>
        
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword', { 
              validate: (val: string) => {
                if (watch('password') !== val) {
                  return 'Passwords do not match';
                }
              },
            })}
            className={errors.confirmPassword ? 'error' : ''}
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword.message}</span>
          )}
        </div>
        
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="terms"
            {...register('terms', { required: 'You must accept the terms' })}
          />
          <label htmlFor="terms">Accept terms and conditions</label>
          {errors.terms && <span className="error-message">{errors.terms.message}</span>}
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={!isDirty || Object.keys(errors).length > 0}
        >
          Submit
        </button>
      </form>
      
      <style jsx>{`
        .form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        
        input.error {
          border-color: #ff4d4f;
        }
        
        .error-message {
          color: #ff4d4f;
          font-size: 14px;
          margin-top: 5px;
          display: block;
        }
        
        .checkbox {
          display: flex;
          align-items: center;
        }
        
        .checkbox input {
          width: auto;
          margin-right: 8px;
        }
        
        .submit-button {
          background-color: #1890ff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
        }
        
        .submit-button:disabled {
          background-color: #d9d9d9;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default AdvancedFormExample;