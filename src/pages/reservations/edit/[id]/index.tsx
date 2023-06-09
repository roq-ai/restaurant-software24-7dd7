import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getReservationsById, updateReservationsById } from 'apiSdk/reservations';
import { Error } from 'components/error';
import { reservationsValidationSchema } from 'validationSchema/reservations';
import { ReservationsInterface } from 'interfaces/reservations';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { UsersInterface } from 'interfaces/users';
import { RestaurantsInterface } from 'interfaces/restaurants';
import { getUsers } from 'apiSdk/users';
import { getRestaurants } from 'apiSdk/restaurants';

function ReservationsEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ReservationsInterface>(id, getReservationsById);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ReservationsInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateReservationsById(id, values);
      mutate(updated);
      resetForm();
      router.push('/reservations');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ReservationsInterface>({
    initialValues: data,
    validationSchema: reservationsValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Reservations
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="table_number" mb="4" isInvalid={!!formik.errors.table_number}>
              <FormLabel>Table Number</FormLabel>
              <NumberInput
                name="table_number"
                value={formik.values.table_number}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('table_number', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.table_number && <FormErrorMessage>{formik.errors.table_number}</FormErrorMessage>}
            </FormControl>
            <FormControl id="reservation_date" mb="4">
              <FormLabel>Reservation Date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values.reservation_date}
                onChange={(value: Date) => formik.setFieldValue('reservation_date', value)}
              />
            </FormControl>
            <FormControl id="reservation_time" mb="4" isInvalid={!!formik.errors.reservation_time}>
              <FormLabel>Reservation Time</FormLabel>
              <Input
                type="text"
                name="reservation_time"
                value={formik.values.reservation_time}
                onChange={formik.handleChange}
              />
              {formik.errors.reservation_time && <FormErrorMessage>{formik.errors.reservation_time}</FormErrorMessage>}
            </FormControl>
            <FormControl id="status" mb="4" isInvalid={!!formik.errors.status}>
              <FormLabel>Status</FormLabel>
              <Input type="text" name="status" value={formik.values.status} onChange={formik.handleChange} />
              {formik.errors.status && <FormErrorMessage>{formik.errors.status}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UsersInterface>
              formik={formik}
              name={'customer_id'}
              label={'Customer'}
              placeholder={'Select Users'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record.id}
                </option>
              )}
            />
            <AsyncSelect<RestaurantsInterface>
              formik={formik}
              name={'restaurant_id'}
              label={'Restaurant'}
              placeholder={'Select Restaurants'}
              fetcher={getRestaurants}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record.id}
                </option>
              )}
            />
            <AsyncSelect<UsersInterface>
              formik={formik}
              name={'waiter_id'}
              label={'Waiter'}
              placeholder={'Select Users'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record.id}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default ReservationsEditPage;
