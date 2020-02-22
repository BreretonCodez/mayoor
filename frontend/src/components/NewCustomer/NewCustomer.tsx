import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik, FormikErrors, FieldArray } from 'formik';
import { Form, Icon, Input, Button, Row, Col, Divider, message, Checkbox } from 'antd';
import { useMutation } from 'react-apollo';

import { CreateCustomerMutation, CreateCustomerMutationVariables } from '../../__generated__/types';

import { StyledForm, StyledDivider, StyledFormItem } from './NewCustomer.styles';
import { CREATE_CUSTOMER_MUTATION } from './queries';

const initialValues = {
	name: '',
	identificationNumber: '',
	taxIdentificationNumber: '',
	personName: '',
	phone: '',
	email: '',
	note: '',
	allowedBankPayments: false,
	addresses: [
		{ isPrimary: true, street: '', city: '', postNumber: '', state: '' },
		{ isPrimary: false, street: '', city: '', postNumber: '', state: '' },
	],
};

type FormValues = typeof initialValues;

export const NewCustomer: React.FC = () => {
	const { t } = useTranslation();

	const [createCustomer, { loading }] = useMutation<
		CreateCustomerMutation,
		CreateCustomerMutationVariables
	>(CREATE_CUSTOMER_MUTATION);

	const formik = useFormik<FormValues>({
		initialValues,
		validate: (values) => {
			const errors: FormikErrors<FormValues> = {};
			if (!values.name) {
				errors.name = t('missing_company_name');
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				await createCustomer({ variables: { input: values } });
				message.success(t('customer_created'));
				formik.resetForm();
			} catch (err) {
				console.error(err);
				message.error(t('customer_created_fail'));
			}
		},
	});

	const getField = (name: keyof FormValues, label: string, icon?: string) => {
		const errorMessage = formik.touched[name] && formik.errors[name];
		const status = errorMessage ? 'error' : '';
		const value = formik.values[name];
		if (typeof value !== 'string') {
			throw new Error('Cant use regular input for anything else but input.');
		}
		return (
			<StyledFormItem validateStatus={status} help={errorMessage}>
				<Input
					prefix={icon && <Icon type={icon} />}
					placeholder={label}
					name={name}
					onChange={formik.handleChange}
					value={value}
				/>
			</StyledFormItem>
		);
	};
	return (
		<StyledForm onSubmit={formik.handleSubmit}>
			<Row gutter={32}>
				<Col xs={24} sm={12}>
					{getField('name', t('Company name'), 'contacts')}
					<Row gutter={16}>
						<Col span={12}>
							{getField('identificationNumber', t('Identification number'), 'number')}
						</Col>
						<Col span={12}>
							{getField(
								'taxIdentificationNumber',
								t('Tax identification number'),
								'hdd',
							)}
						</Col>
					</Row>
					<StyledDivider orientation="left">{t('Contact person')}</StyledDivider>
					{getField('personName', t('Contact person name'), 'user')}
					<Row gutter={16}>
						<Col span={12}>{getField('email', t('Email'), 'mail')}</Col>
						<Col span={12}>{getField('phone', t('Phone'), 'phone')}</Col>
					</Row>
				</Col>
				<Col xs={24} sm={12}>
					<Checkbox
						name="allowedBankPayments"
						onClick={() =>
							formik.setFieldValue(
								'allowedBankPayments',
								!formik.values.allowedBankPayments,
							)
						}
						checked={formik.values.allowedBankPayments}
					>
						{t('Allow bank payments')}
					</Checkbox>
					<StyledFormItem label={t('Note')}>
						<Input.TextArea
							rows={4}
							placeholder={t('customer_note_placeholder')}
							onChange={formik.handleChange}
						/>
					</StyledFormItem>
				</Col>
			</Row>
			<Row gutter={32}>
				{[{ label: t('Shipping address') }, { label: t('Billing address') }].map(
					({ label }, i) => (
						<Col xs={24} sm={12} key={i}>
							<StyledDivider orientation="left">{label}</StyledDivider>
							<StyledFormItem>
								<Input
									name={`addresses.${i}.street`}
									prefix={<Icon type="environment" />}
									placeholder={t('Street')}
									onChange={formik.handleChange}
									value={formik.values.addresses[i].street}
								/>
							</StyledFormItem>
							<Row gutter={12}>
								<Col span={16}>
									<StyledFormItem>
										<Input
											name={`addresses.${i}.city`}
											prefix={<Icon type="home" />}
											placeholder={t('City')}
											onChange={formik.handleChange}
											value={formik.values.addresses[i].city}
										/>
									</StyledFormItem>
								</Col>
								<Col span={8}>
									<StyledFormItem>
										<Input
											name={`addresses.${i}.postNumber`}
											prefix={<Icon type="number" />}
											placeholder={t('Post Number')}
											onChange={formik.handleChange}
											value={formik.values.addresses[i].postNumber}
										/>
									</StyledFormItem>
								</Col>
							</Row>
						</Col>
					),
				)}
			</Row>
			<Button type="primary" htmlType="submit" loading={loading} style={{ marginTop: 10 }}>
				{t('Add customer')}
			</Button>
		</StyledForm>
	);
};
