import React, { useRef, useCallback, useState } from 'react';

import { FiCheckSquare, FiFrown } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';

import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors'

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleUpdateFood: (food: Omit<IFoodPlate, 'id' | 'available'>) => void;
  editingFood: IFoodPlate;
}

interface IEditFoodData {
  name: string;
  image: string;
  price: string;
  description: string;
}

const ModalEditFood: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  editingFood,
  handleUpdateFood,
}) => {
  const formRef = useRef<FormHandles>(null);

  const [unexpectedError, setUnexpectedError] = useState('');

  const handleSubmit = useCallback(
    async (data: IEditFoodData) => {

      try {
        if (formRef.current) formRef.current.setErrors({});
        setUnexpectedError('');

        const schema = Yup.object().shape({
          image: Yup.string()
            .required('Link de imagem obrigatório')
            .url('Link de imagem inválido'),
          name: Yup.string()
            .required('Nome obrigatório'),
          price: Yup.number()
            .required('Preço obrigatório')
            .typeError('O preço deve ser um número'),
          description: Yup.string().required('Descrição obrigatória'),
        });

        await schema.validate(data, { abortEarly: false });

        handleUpdateFood(data);

        setIsOpen()

      } catch(err) {
        let description = '';

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          if (formRef.current) {
            formRef.current.setErrors(errors);

            return;
          }
        }

        if (err instanceof Error) {
          description = err.message;
        }

        setUnexpectedError(description);
      }
    },
    [handleUpdateFood, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>

        {unexpectedError &&
          <strong>
            <FiFrown size={20} />
            Desculpe. Aconteceu um erro. Tente adicionar o prato novamente.
          </strong>
        }

        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalEditFood;
