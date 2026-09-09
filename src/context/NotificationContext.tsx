import {
  createContext,
  ReactNode,
  useCallback,
  useState,
} from "react";

import notificationApi from "../api/NotificationApi";

import {
  NotificationMetadata,
} from "../types/NotificationType";

import {
  getApiError,
} from "../utils/apiError";

interface NotificationContextType {

  channels: NotificationMetadata[];

  types: NotificationMetadata[];

  priorities: NotificationMetadata[];

  loading: boolean;

  message: string;

  loadChannels(): Promise<boolean>;

  loadTypes(): Promise<boolean>;

  loadPriorities(): Promise<boolean>;

  loadAll(): Promise<boolean>;

  clearMessage(): void;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationContext =
  createContext<
    NotificationContextType | null
  >(null);

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {

  const [
    channels,
    setChannels,
  ] = useState<NotificationMetadata[]>([]);

  const [
    types,
    setTypes,
  ] = useState<NotificationMetadata[]>([]);

  const [
    priorities,
    setPriorities,
  ] = useState<NotificationMetadata[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const loadChannels = useCallback(
    async (): Promise<boolean> => {

      try {

        setLoading(true);
        setMessage("");

        const response =
          await notificationApi
            .getChannels();

        setMessage(
          response.message
        );

        if (response.success) {
          setChannels(
            response.data
          );
        }

        return response.success;

      } catch (error) {

        const apiError =
          getApiError(error);

        setMessage(
          apiError.message
        );

        return false;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  const loadTypes = useCallback(
    async (): Promise<boolean> => {

      try {

        setLoading(true);
        setMessage("");

        const response =
          await notificationApi
            .getTypes();

        setMessage(
          response.message
        );

        if (response.success) {
          setTypes(
            response.data
          );
        }

        return response.success;

      } catch (error) {

        const apiError =
          getApiError(error);

        setMessage(
          apiError.message
        );

        return false;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  const loadPriorities = useCallback(
    async (): Promise<boolean> => {

      try {

        setLoading(true);
        setMessage("");

        const response =
          await notificationApi
            .getPriorities();

        setMessage(
          response.message
        );

        if (response.success) {
          setPriorities(
            response.data
          );
        }

        return response.success;

      } catch (error) {

        const apiError =
          getApiError(error);

        setMessage(
          apiError.message
        );

        return false;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  const loadAll = useCallback(
    async (): Promise<boolean> => {

      try {

        setLoading(true);
        setMessage("");

        const [
          channelsResponse,
          typesResponse,
          prioritiesResponse,
        ] = await Promise.all([
          notificationApi.getChannels(),
          notificationApi.getTypes(),
          notificationApi.getPriorities(),
        ]);

        if (
          channelsResponse.success
        ) {
          setChannels(
            channelsResponse.data
          );
        }

        if (
          typesResponse.success
        ) {
          setTypes(
            typesResponse.data
          );
        }

        if (
          prioritiesResponse.success
        ) {
          setPriorities(
            prioritiesResponse.data
          );
        }

        /*
         * Display the backend message.
         *
         * Since multiple endpoints are
         * involved, use the first failure
         * message if any request failed.
         */
        const failedResponse =
          [
            channelsResponse,
            typesResponse,
            prioritiesResponse,
          ].find(
            (response) =>
              !response.success
          );

        setMessage(
          failedResponse?.message ??
          channelsResponse.message
        );

        return !failedResponse;

      } catch (error) {

        const apiError =
          getApiError(error);

        setMessage(
          apiError.message
        );

        return false;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  const clearMessage = () => {
    setMessage("");
  };

  const value: NotificationContextType = {

    channels,

    types,

    priorities,

    loading,

    message,

    loadChannels,

    loadTypes,

    loadPriorities,

    loadAll,

    clearMessage,
  };

  return (
    <NotificationContext.Provider
      value={value}
    >
      {children}
    </NotificationContext.Provider>
  );
};