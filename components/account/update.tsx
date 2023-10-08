import { revalidatePath } from "next/cache"
import { getClient } from "../../app/graphql-rsc"
import {
  AccountDetailsByAccountIdDocument,
  AccountDetailsByAccountIdQuery,
  AccountDetailsByAccountIdQueryVariables,
  AccountLevel,
  AccountStatus,
  AccountUpdateLevelDocument,
  AccountUpdateLevelMutation,
  AccountUpdateLevelMutationVariables,
  AccountUpdateStatusDocument,
  AccountUpdateStatusMutation,
  AccountUpdateStatusMutationVariables,
  AuditedAccount,
} from "../../generated"
import ConfirmForm from "./confirm"

type PropType = {
  auditedAccount: AuditedAccount
}

const updateLevel = async (formData: FormData) => {
  "use server"
  console.log("update level")

  const id = formData.get("id") as string

  const { data } = await getClient().query<
    AccountDetailsByAccountIdQuery,
    AccountDetailsByAccountIdQueryVariables
  >({
    query: AccountDetailsByAccountIdDocument,
    variables: { accountId: id },
  })

  const auditedAccount = data?.accountDetailsByAccountId

  await getClient().mutate<
    AccountUpdateLevelMutation,
    AccountUpdateLevelMutationVariables
  >({
    mutation: AccountUpdateLevelDocument,
    variables: { input: { uid: auditedAccount.id, level: AccountLevel.Two } },
  })

  revalidatePath("/account")
}

const updateStatus = async (formData: FormData) => {
  "use server"
  const id = formData.get("id") as string

  const { data } = await getClient().query<
    AccountDetailsByAccountIdQuery,
    AccountDetailsByAccountIdQueryVariables
  >({
    query: AccountDetailsByAccountIdDocument,
    variables: { accountId: id },
  })

  const auditedAccount = data?.accountDetailsByAccountId

  const targetStatus =
    auditedAccount.status === "ACTIVE" ? AccountStatus.Locked : AccountStatus.Active

  await getClient().mutate<
    AccountUpdateStatusMutation,
    AccountUpdateStatusMutationVariables
  >({
    mutation: AccountUpdateStatusDocument,
    variables: { input: { uid: auditedAccount.id, status: targetStatus } },
  })

  revalidatePath("/account")
}

const AccountUpdate: React.FC<PropType> = ({ auditedAccount }) => {
  const isActiveStatus = auditedAccount.status === "ACTIVE"
  const statusColor = isActiveStatus ? "red" : "green"
  const statusButtonLabel = isActiveStatus ? "Lock" : "Activate"

  return (
    <div className="shadow p-6 min-w-0 rounded-lg shadow-xs overflow-hidden bg-white grid grid-cols-2 gap-4">
      <div>
        <p className="mb-4 font-semibold text-gray-600">Level</p>
        <div className={`text-gray-600`}>
          {auditedAccount.level}
          {auditedAccount.level === "ONE" && (
            <ConfirmForm
              action={updateLevel}
              message="Are you sure you want to update the level?"
            >
              <input type="hidden" name="id" value={auditedAccount.uuid} />
              <button className="text-sm mx-4 bg-green-500 hover:bg-green-700 text-white font-bold p-2 border border-green-700 rounded disabled:opacity-50">
                {"Upgrade"}
              </button>
            </ConfirmForm>
          )}
        </div>
      </div>
      <div>
        <p className="mb-4 font-semibold text-gray-600">Status</p>
        <div className={`text-gray-600`}>
          {auditedAccount.status}
          <ConfirmForm
            action={updateStatus}
            message="Are you sure you want to update the status?"
          >
            <input type="hidden" name="id" value={auditedAccount.uuid} />
            <button
              className={`text-sm mx-4 bg-${statusColor}-500 hover:bg-${statusColor}-700 text-white font-bold p-2 border border-${statusColor}-700 rounded disabled:opacity-50`}
            >
              {statusButtonLabel}
            </button>
          </ConfirmForm>
        </div>
      </div>
    </div>
  )
}

export default AccountUpdate
