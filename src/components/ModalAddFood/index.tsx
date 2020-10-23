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

interface ICreateFoodData {
  name: string;
  image: string;
  price: string;
  description: string;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleAddFood: (food: Omit<IFoodPlate, 'id' | 'available'>) => void;
}

const ModalAddFood: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  handleAddFood,
}) => {
  const formRef = useRef<FormHandles>(null);

  const [unexpectedError, setUnexpectedError] = useState('');

  const handleSubmit = useCallback(
    async (data: ICreateFoodData) => {
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

        const {image, name, description, price} = data;

        handleAddFood({image, name, description, price})

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
    [handleAddFood, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>

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
        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalAddFood;
