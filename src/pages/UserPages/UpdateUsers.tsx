
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import UserForm from "../../components/customforms/UserForm";

import {
  useUser,
} from "../../hooks/useUser";

import {
  User,
  UpdateUserDto,
} from "../../types/UserType";


export default function UpdateUser() {

  const {
    userId,
  } = useParams<{
    userId: string;
  }>();


  const navigate =
    useNavigate();


  const {
    selectedUser,
    loading,
    message,

    fetchUser,
    updateUser,
    clearMessage,
  } = useUser();


  const [
    user,
    setUser,
  ] = useState<User | null>(null);


  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  /*
   * ============================================================
   * FETCH USER
   * ============================================================
   */

  useEffect(() => {

    if (!userId) {
      return;
    }


    const loadUser = async () => {

      const result =
        await fetchUser(userId);


      if (result) {
        setUser(result);
      }

    };


    void loadUser();

  }, [
    userId,
    fetchUser,
  ]);


  /*
   * ============================================================
   * KEEP LOCAL USER IN SYNC
   * ============================================================
   */

  useEffect(() => {

    if (selectedUser) {

      setUser(
        selectedUser
      );

    }

  }, [
    selectedUser,
  ]);


  /*
   * ============================================================
   * CLEAR MESSAGE ON UNMOUNT
   * ============================================================
   */

  useEffect(() => {

    return () => {
      clearMessage();
    };

  }, [
    clearMessage,
  ]);


  /*
   * ============================================================
   * SUBMIT
   * ============================================================
   */

  const handleSubmit = useCallback(
    async (
      data: UpdateUserDto
    ) => {

      if (!userId || !user) {
        return;
      }


      setSubmitting(true);


      try {

        const success =
          await updateUser(
            userId,
            data
          );


        if (success) {

          navigate(
            `/users/${userId}`
          );

        }

      } finally {

        setSubmitting(false);
      }

    },
    [
      userId,
      user,
      updateUser,
      navigate,
    ]
  );


  /*
   * ============================================================
   * CANCEL
   * ============================================================
   */

  const handleCancel =
    useCallback(() => {

      if (userId) {

        navigate(
          `/users/${userId}`
        );

        return;
      }


      navigate("/users");

    }, [
      userId,
      navigate,
    ]);


  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading && !user) {

    return (
      <>
        <PageMeta
          title="Update User"
          description="Update user account"
        />

        <div className="flex items-center justify-center py-12">

          <p
            className="
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Loading user...
          </p>

        </div>
      </>
    );
  }


  /*
   * ============================================================
   * USER NOT FOUND
   * ============================================================
   */

  if (!user) {

    return (
      <>
        <PageMeta
          title="Update User"
          description="Update user account"
        />

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-6
            dark:border-gray-800
            dark:bg-white/[0.03]
          "
        >

          <div className="text-center">

            <h3
              className="
                text-lg
                font-semibold
                text-gray-800
                dark:text-white/90
              "
            >
              User not found
            </h3>


            <p
              className="
                mt-2
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              {message ||
                "The requested user could not be found."}
            </p>


            <button
              type="button"
              onClick={() =>
                navigate("/users")
              }
              className="
                mt-5
                rounded-lg
                bg-brand-500
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                hover:bg-brand-600
              "
            >
              Back to Users
            </button>

          </div>

        </div>
      </>
    );
  }


  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <>
      <PageMeta
        title="Update User"
        description="Update user account"
      />


      <div className="space-y-6">

        <div>

          <h2
            className="
              text-xl
              font-semibold
              text-gray-800
              dark:text-white/90
            "
          >
            Update User
          </h2>


          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Update the user's role and account status.
          </p>

        </div>


        <UserForm
          user={user}
          loading={
            loading ||
            submitting
          }
          onSubmit={
            handleSubmit
          }
          onCancel={
            handleCancel
          }
        />

      </div>
    </>
  );
}