import { createContext, useContext, useState, useEffect } from 'react'
import { web3Service } from '../services/web3Service'

const Web3Context = createContext()

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null)
  const [isInstitution, setIsInstitution] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initWeb3()
    window.ethereum?.on('accountsChanged', handleAccountChange)
    
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountChange)
    }
  }, [])

  const initWeb3 = async () => {
    try {
      setLoading(true)
      const { address } = await web3Service.connect()
      setAccount(address)
      const institutionStatus = await web3Service.isInstitution(address)
      setIsInstitution(institutionStatus)
    } catch (error) {
      console.error('Failed to initialize web3:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccountChange = async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0])
      const institutionStatus = await web3Service.isInstitution(accounts[0])
      setIsInstitution(institutionStatus)
    } else {
      setAccount(null)
      setIsInstitution(false)
    }
  }

  return (
    <Web3Context.Provider value={{ 
      account, 
      isInstitution, 
      loading,
      web3Service,
      connect: initWeb3
    }}>
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = () => useContext(Web3Context) 