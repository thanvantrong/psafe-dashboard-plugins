/*
 * Psafe app - React component for button that opens a modal
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import React from 'react';

import {
  EuiOverlayMask,
  EuiOutsideClickDetector,
  EuiConfirmModal
} from '@elastic/eui';

import { withButtonOpenOnClick } from '../hocs';
import { PaButton } from './button';
import { PaButtonPermissions } from '../permissions/button';

export const PaButtonOpenOnClick = withButtonOpenOnClick(PaButton);
export const PaButtonPermissionsOpenOnClick = withButtonOpenOnClick(PaButtonPermissions);

interface PaButtonModalConfirmProps{
  onConfirm: (ev) => void
  onCancel?: (ev) => void
  modalTitle: string
  modalConfirmText?: string
  modalCancelText?: string
  modalProps: any
  [key: string]: any
};

const renderModal = ({onConfirm, onCancel, modalTitle, modalConfirmText, modalCancelText, modalProps }) => ({close}) => {
  const onModalConfirm = () => {
    close();
    onConfirm && onConfirm();
  };
  const onModalCancel = () => {
    close();
    onCancel && onCancel();
  };
  return (
    <EuiOverlayMask>
      <EuiOutsideClickDetector onOutsideClick={close}>
        <EuiConfirmModal
          title={modalTitle}
          onCancel={onModalCancel}
          onConfirm={onModalConfirm}
          cancelButtonText={modalCancelText}
          confirmButtonText={modalConfirmText}
          defaultFocusedButton={modalProps.defaultFocusedButton || "confirm"}
          {...modalProps}
        >
        </EuiConfirmModal>
      </EuiOutsideClickDetector>
    </EuiOverlayMask>
  )
};

export const PaButtonModalConfirm: React.FunctionComponent<PaButtonModalConfirmProps> = ({onConfirm, onCancel, modalTitle, modalConfirmText = 'Confirm', modalCancelText = 'Cancel', modalProps = {}, ...rest }) => {
  return (
    <PaButtonOpenOnClick
      {...rest}
      render={({close}) => {
        const onModalConfirm = () => {
          close();
          onConfirm && onConfirm();
        };
        const onModalCancel = () => {
          close();
          onCancel && onCancel();
        };
        return (
          <EuiOverlayMask>
            <EuiOutsideClickDetector onOutsideClick={close}>
              <EuiConfirmModal
                title={modalTitle}
                onCancel={onModalCancel}
                onConfirm={onModalConfirm}
                cancelButtonText={modalCancelText}
                confirmButtonText={modalConfirmText}
                defaultFocusedButton={modalProps.defaultFocusedButton || "confirm"}
                {...modalProps}
              >
              </EuiConfirmModal>
            </EuiOutsideClickDetector>
          </EuiOverlayMask>
        )
      }}
    />
  )
};

export const PaButtonPermissionsModalConfirm: React.FunctionComponent<PaButtonModalConfirmProps> = ({onConfirm, onCancel, modalTitle, modalConfirmText = 'Confirm', modalCancelText = 'Cancel', modalProps = {}, ...rest }) => {
  return (
    <PaButtonPermissionsOpenOnClick
      {...rest}
      render={renderModal({onConfirm, onCancel, modalTitle, modalConfirmText, modalCancelText, modalProps })}
    />
  )
};

